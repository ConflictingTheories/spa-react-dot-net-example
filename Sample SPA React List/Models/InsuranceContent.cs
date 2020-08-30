using System;
using System.Text.Json.Serialization;

namespace Sample_SPA_React_List
{
    public class InsuranceContent
    {
        public int Id { get; set; }

        public string ContentDescription { get; set; }

        public double ContentValue { get; set; }

        public int CategoryId { get; set; }

        [JsonIgnore]
        public InsuranceCategory Category { get; set; }

    }

    public class InsuranceContentRequest
    {
        public int Id { get; set; }

        public string ContentDescription { get; set; }

        public double ContentValue { get; set; }

        public int? CategoryId { get; set; }

        public string? CategoryName { get; set; }

    }
}
