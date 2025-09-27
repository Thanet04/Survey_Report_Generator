using Dapper;
using MySql.Data.MySqlClient;
using SurveyBackend.Models;

public interface IAnswerRepository
{
    Task<int> SubmitAnswer(Answer answer);
    Task<IEnumerable<Answer>> GetAnswersBySurveyId(int surveyId);
}

public class AnswerRepository : IAnswerRepository
{
    private readonly string _connectionString;

    public AnswerRepository(IConfiguration config)
    {
        _connectionString = config.GetConnectionString("DefaultConnection")!;
    }

    public async Task<int> SubmitAnswer(Answer answer)
    {
        using var conn = new MySqlConnection(_connectionString);
        var sql = @"insert into answer (surveyId, questionId, userId, answerText) 
                    values (@SurveyId, @QuestionId, @UserId, @AnswerText); 
                    select LAST_INSERT_ID();";
        return await conn.ExecuteScalarAsync<int>(sql, answer);
    }

    public async Task<IEnumerable<Answer>> GetAnswersBySurveyId(int surveyId)
    {
        using var conn = new MySqlConnection(_connectionString);
        var sql = "select * from answer where SurveyId = @SurveyId";
        return await conn.QueryAsync<Answer>(sql, new { SurveyId = surveyId });
    }
}
