using Microsoft.AspNetCore.Mvc;
using SurveyBackend.Models;
using SurveyBackend.Repositories;

[ApiController]
[Route("api/[controller]")]
public class SurveyController : ControllerBase
{
    private readonly ISurveyRepository _surveyRepo;
    private readonly IQuestionRepository _questionRepo;

    public SurveyController(ISurveyRepository surveyRepo, IQuestionRepository questionRepo)
    {
        _surveyRepo = surveyRepo;
        _questionRepo = questionRepo;
    }

    [HttpPost]
    public async Task<IActionResult> CreateSurvey([FromBody] Survey survey)
    {
        var surveyId = await _surveyRepo.CreateSurvey(survey);
        return Ok(new { SurveyId = surveyId });
    }

    [HttpGet]
    public async Task<IActionResult> GetAllSurveys()
    {
        var surveys = await _surveyRepo.GetAllSurveys();
        return Ok(surveys);
    }

    [HttpGet("{surveyId}")]
    public async Task<IActionResult> GetSurvey(int surveyId)
    {
        var survey = await _surveyRepo.GetSurveyById(surveyId);
        if (survey == null) return NotFound();
        var question = await _questionRepo.GetQuestions(surveyId);
        return Ok(new { survey, question });
    }

    [HttpPut("{surveyId}")]
    public async Task<IActionResult> UpdateSurvey(int surveyId, [FromBody] Survey survey)
    {
        var existing = await _surveyRepo.GetSurveyById(surveyId);
        if (existing == null)
            return NotFound(new { message = "ไม่พบแบบสอบถามนี้" });

        existing.Title = survey.Title; // อัปเดต title
        await _surveyRepo.UpdateSurvey(existing);

        return Ok(new { message = "อัปเดตแบบสอบถามเรียบร้อย" });
    }


    [HttpDelete("{surveyId}")]
    public async Task<IActionResult> DeleteSurvey(int surveyId)
    {
        // ตรวจสอบว่า survey มีอยู่หรือไม่
        var survey = await _surveyRepo.GetSurveyById(surveyId);
        if (survey == null)
            return NotFound(new { message = "ไม่พบแบบสอบถามนี้" });

        var questions = await _questionRepo.GetQuestions(surveyId);
        foreach (var q in questions)
        {
            await _questionRepo.DeleteQuestion(q.Id);
        }

        await _surveyRepo.DeleteSurvey(surveyId);

        return Ok(new { message = "ลบแบบสอบถามเรียบร้อยแล้ว" });
    }

}
