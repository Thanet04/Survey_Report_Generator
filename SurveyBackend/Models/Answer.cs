namespace SurveyBackend.Models{
    
    public class Answer
    {
        public int Id { get; set; }          
        public int SurveyId { get; set; }
        public int QuestionId { get; set; }
        public int UserId { get; set; }
        public string AnswerText { get; set; } = string.Empty; 
    }
}
