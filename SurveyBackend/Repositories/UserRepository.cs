using Dapper;
using MySql.Data.MySqlClient;
using Microsoft.Extensions.Configuration;
using SurveyBackend.Models;

namespace SurveyBackend.Repositories
{
    public interface IUserRepository
    {
        Task<User?> GetByUsername(string username);
        Task<int> CreateUser(User user);
    }

    public class UserRepository : IUserRepository
    {
        private readonly string _connectionString;

        public UserRepository(IConfiguration config)
        {
            _connectionString = config.GetConnectionString("DefaultConnection")!;
        }

        public async Task<User?> GetByUsername(string username)
        {
            using var conn = new MySqlConnection(_connectionString);
            string sql = "select * from Users where Username = @Username";
            return await conn.QueryFirstOrDefaultAsync<User>(sql, new { Username = username });
        }

        public async Task<int> CreateUser(User user)
        {
            using var conn = new MySqlConnection(_connectionString);

            var sql = @"
                insert into Users (Username, Password, Role)
                values (@Username, @Password, @Role);
                select LAST_INSERT_ID();";

            return await conn.ExecuteScalarAsync<int>(sql, user);
        }
    }
}
