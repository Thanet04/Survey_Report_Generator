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


    [HttpPut("{questionId}")]
    public async Task<IActionResult> UpdateQuestion(int questionId, [FromBody] Question question)
    {
        var existing = await _questionRepo.GetQuestionById(questionId);
        if (existing == null)
            return NotFound(new { message = "ไม่พบคำถามนี้" });

        existing.Text = question.Text;
        existing.Type = question.Type;
        existing.Options = question.Options;

        await _questionRepo.UpdateQuestion(existing);

        return Ok(new { message = "อัปเดตคำถามเรียบร้อย" });
    }
    
    [HttpGet("{surveyId}")]
    public async Task<IActionResult> GetQuestions(int surveyId)
    {
        var question = await _questionRepo.GetQuestions(surveyId);
        return Ok(question);
    }
}
