using Dapper;
using MySql.Data.MySqlClient;
using SurveyBackend.Models;
using System.Text.Json;

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
        var sql = "insert into question (SurveyId, Text , Type , Options) values (@SurveyId, @Text, @Type, @Options); select LAST_INSERT_ID();";
        return await conn.ExecuteScalarAsync<int>(sql, question);
    }

    public async Task<IEnumerable<Question>> GetQuestions(int surveyId)
    {
        using var conn = new MySqlConnection(_connectionString);
        var sql = "SELECT * FROM question WHERE SurveyId = @SurveyId";
        var list = await conn.QueryAsync<Question>(sql, new { SurveyId = surveyId });

        // OptionsList จะ parse JSON อัตโนมัติจาก get accessor
        return list;
    }


}
