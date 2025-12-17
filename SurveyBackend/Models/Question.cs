namespace SurveyBackend.Models
{
    public class Question
    {
        public int Id { get; set; }
        public int SurveyId { get; set; }
        public string Text { get; set; } = null!;
        public string Type { get; set; } = "text";

        // Options เก็บเป็น JSON string ใน DB
        public string? Options { get; set; } = "[]";

        // ตัวช่วย convert JSON string -> List<string>
        public List<string> OptionsList
        {
            get => string.IsNullOrEmpty(Options)
                    ? new List<string>()
                    : System.Text.Json.JsonSerializer.Deserialize<List<string>>(Options)!;
            set => Options = System.Text.Json.JsonSerializer.Serialize(value);
        }
    }
}
