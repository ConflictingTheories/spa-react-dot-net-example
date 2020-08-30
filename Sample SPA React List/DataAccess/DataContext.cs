using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;


namespace Sample_SPA_React_List.DataAccess
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options)
        {
        }

        public DbSet<InsuranceCategory> Categories { get; set; }

        public DbSet<InsuranceContent> Contents { get; set; }
    }
}
