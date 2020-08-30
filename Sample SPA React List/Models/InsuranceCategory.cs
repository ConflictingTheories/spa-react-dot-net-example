using System;
using System.Collections;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sample_SPA_React_List
{
    public class InsuranceCategory
    {
        public int Id { get; set; }

        public string CategoryName { get; set; }

        public virtual ICollection<InsuranceContent> Contents { get; set; }
    }
}
