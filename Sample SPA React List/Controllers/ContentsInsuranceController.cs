using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Sample_SPA_React_List.DataAccess;

namespace Sample_SPA_React_List.Controllers
{
    [ApiController]
    [Route("insurance")]
    public class ContentsInsuranceController : ControllerBase
    {

        private readonly DataContext _db;

        private readonly ILogger<ContentsInsuranceController> _logger;

        public ContentsInsuranceController(ILogger<ContentsInsuranceController> logger, DataContext dbContext)
        {
            _logger = logger;
            _db = dbContext;
        }

        /* GET /contents - Returns list of Insurance Contents */
        [HttpGet("contents")]
        async public Task<IEnumerable<InsuranceContent>> GetContents(int id)
        {
            return await _db.Contents.Include("Category").ToListAsync();
        }

        /* GET /contents/;id - Returns Content Item*/
        [HttpGet("contents/{id}")]
        async public Task<InsuranceContent> GetContentById(int id)
        {
            return await _db.Contents.Include("Category").Where(x => x.Id == id).FirstAsync();
        }

        /* GET /categories - Returns list of Categories */
        [HttpGet("categories")]
        async public Task<IEnumerable<InsuranceCategory>> GetCategories()
        {
            return await _db.Categories.Include("Contents").ToListAsync();
        }

        /* GET /categories/:id - Returns Categort by Id */
        [HttpGet("categories/{id}")]
        async public Task<InsuranceCategory> GetCategoryById(int id)
        {
            if (!CategoriesExists(id))
                return null;
            else
                return await _db.Categories.Include("Contents").Where(x => x.Id == id).FirstAsync();
        }

        /* POST /add - Adds an Insurance Content Item to List */
        [HttpPost("contents/add")]
        async public Task<InsuranceContent> AddContent(InsuranceContentRequest content)
        {
            InsuranceContent newContent;
            InsuranceCategory category;

            if (!CategoriesExists(content.CategoryId, content.CategoryName))
            {
                category = new InsuranceCategory() { CategoryName = content.CategoryName };
                _db.Categories.Add(category);
            }
            else
            {
                category = await _db.Categories.Where(x => x.Id == content.CategoryId || x.CategoryName == content.CategoryName).FirstAsync();
            }

            newContent = new InsuranceContent { ContentDescription = content.ContentDescription, ContentValue = content.ContentValue, Category = category, CategoryId = category.Id };
            _db.Contents.Add(newContent);

            await _db.SaveChangesAsync();

            return newContent;
        }

        /* POST /delete/{id} - Removes an Object from List */
        [HttpPost("contents/delete/{id}")]
        async public Task<Boolean> DeleteContent(int id)
        {
            if (ContentExists(id))
            {
                var old = await _db.Contents.FindAsync(id);
                _db.Contents.Remove(old);
                await _db.SaveChangesAsync();
            }
            return true;
        }


        private bool CategoriesExists(int? id, string name = "") => _db.Categories.Any(e => e.Id == id || e.CategoryName == name);
        private bool ContentExists(int id) => _db.Contents.Any(e => e.Id == id);


    }
}
