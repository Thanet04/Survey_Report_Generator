namespace SurveyBackend.Models{

    public class Question
    {
        public int Id { get; set; }
        public int SurveyId { get; set; }
        public string Text { get; set; } = null!;
        public string Type { get; set; }
    }

}
