using Dapper;
using MySql.Data.MySqlClient;
using SurveyBackend.Models;

public interface ISurveyRepository
{
    Task<int> CreateSurvey(Survey survey);
    Task<IEnumerable<Survey>> GetAllSurveys();
    Task<Survey?> GetSurveyById(int surveyId);
}

public class SurveyRepository : ISurveyRepository
{
    private readonly string _connectionString;
    public SurveyRepository(IConfiguration config)
    {
        _connectionString = config.GetConnectionString("DefaultConnection")!;
    }

    public async Task<int> CreateSurvey(Survey survey)
    {
        using var conn = new MySqlConnection(_connectionString);
        var sql = "insert into survey (Title, CreatedBy) values (@Title, @CreatedBy); select LAST_INSERT_ID();";
        return await conn.ExecuteScalarAsync<int>(sql, survey);
    }

    public async Task<IEnumerable<Survey>> GetAllSurveys()
    {
        using var conn = new MySqlConnection(_connectionString);
        return await conn.QueryAsync<Survey>("select * from survey");
    }

    public async Task<Survey?> GetSurveyById(int surveyId)
    {
        using var conn = new MySqlConnection(_connectionString);
        return await conn.QueryFirstOrDefaultAsync<Survey>("select * from survey where Id = @SurveyId", new { SurveyId = surveyId });
    }
}
