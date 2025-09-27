using Dapper;
using MySql.Data.MySqlClient;
using SurveyBackend.Models;

public interface IQuestionRepository
{
    Task<int> CreateQuestion(Question question);
    Task<IEnumerable<Question>> GetQuestions(int surveyId);
}

public class QuestionRepository : IQuestionRepository
{
    private readonly string _connectionString;

    public QuestionRepository(IConfiguration config)
    {
        _connectionString = config.GetConnectionString("DefaultConnection")!;
    }

    public async Task<int> CreateQuestion(Question question)
    {
        using var conn = new MySqlConnection(_connectionString);
        var sql = "insert into question (SurveyId, Text) values (@SurveyId, @Text); select LAST_INSERT_ID();";
        return await conn.ExecuteScalarAsync<int>(sql, question);
    }

    public async Task<IEnumerable<Question>> GetQuestions(int surveyId)
    {
        using var conn = new MySqlConnection(_connectionString);
        var sql = "select * from question where SurveyId = @SurveyId";
        return await conn.QueryAsync<Question>(sql, new { SurveyId = surveyId });
    }
}
