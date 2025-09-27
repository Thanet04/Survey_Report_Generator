namespace SurveyBackend.Models{
    
    public class Survey
    {
        public int Id { get; set; }
        public string Title { get; set; } = null!;
        public int CreatedBy { get; set; }
        public DateTime CreatedAt { get; set; }
    }

}