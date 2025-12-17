using Microsoft.AspNetCore.Mvc;
using SurveyBackend.Models;
using SurveyBackend.Repositories;

[ApiController]
[Route("api/[controller]")]
public class QuestionController : ControllerBase
{
    private readonly IQuestionRepository _questionRepo;

    public QuestionController(IQuestionRepository questionRepo)
    {
        _questionRepo = questionRepo;
    }

    [HttpPost]
    public async Task<IActionResult> CreateQuestion([FromBody] Question question)
    {
       var questionId = await _questionRepo.CreateQuestion(question);
        return Ok(new { questionId });
    }

    [HttpGet("{surveyId}")]
    public async Task<IActionResult> GetQuestions(int surveyId)
    {
        var question = await _questionRepo.GetQuestions(surveyId);
        return Ok(question);
    }
}
