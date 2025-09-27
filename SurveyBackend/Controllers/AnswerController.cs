using Microsoft.AspNetCore.Mvc;
using SurveyBackend.Models;
using SurveyBackend.Repositories;

[ApiController]
[Route("api/[controller]")]
public class AnswerController : ControllerBase
{
    private readonly IAnswerRepository _answerRepo;

    public AnswerController(IAnswerRepository answerRepo)
    {
        _answerRepo = answerRepo;
    }

    [HttpPost]
    public async Task<IActionResult> SubmitAnswer([FromBody] Answer answer)
    {
        var answerId = await _answerRepo.SubmitAnswer(answer);
        return Ok(new { AnswerId = answerId });
    }

    [HttpGet("{surveyId}")]
    public async Task<IActionResult> GetAnswers(int surveyId)
    {
        var answers = await _answerRepo.GetAnswersBySurveyId(surveyId);
        return Ok(answers);
    }
}
