using Dapper;
using MySql.Data.MySqlClient;
using SurveyBackend.Models;

public interface ISurveyRepository
{
    Task<int> CreateSurvey(Survey survey);
    Task<IEnumerable<Survey>> GetAllSurveys();
    Task<Survey?> GetSurveyById(int surveyId);
    Task UpdateSurvey(Survey survey);
    Task DeleteSurvey(int surveyId);
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

    public async Task UpdateSurvey(Survey survey)
    {
        using var conn = new MySqlConnection(_connectionString);
        var sql = "update survey set Title = @Title where Id = @Id";
        await conn.ExecuteAsync(sql, survey);
    }

    public async Task DeleteSurvey(int surveyId)
    {
        using var conn = new MySqlConnection(_connectionString);
        var sql = "delete from survey where Id = @SurveyId";
        await conn.ExecuteAsync(sql, new { SurveyId = surveyId });
    }

}
