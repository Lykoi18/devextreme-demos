﻿using DevExtreme.AspNet.Data;
using DevExtreme.AspNet.Mvc;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using Newtonsoft.Json;
using System.Linq;
using DevExtreme.NETCore.Demos.Models.SampleData;
using DevExtreme.NETCore.Demos.Models;
using DevExtreme.NETCore.Demos.Models.DataGrid;

namespace DevExtreme.NETCore.Demos.Controllers.ApiControllers {
    [Route("api/[controller]/[action]")]
    public class DnDBetweenGridsController : Controller {
        InMemoryRowReorderingTasksDataContext _context;

        public DnDBetweenGridsController(IHttpContextAccessor httpContextAccessor, IMemoryCache memoryCache) {
            _context = new InMemoryRowReorderingTasksDataContext(httpContextAccessor, memoryCache);
        }

        [HttpGet]
        public object Tasks(DataSourceLoadOptions loadOptions) {
            return DataSourceLoader.Load(_context.Tasks.Where(task => task.Status < 3).Take(10).ToList<RowReorderingTask>(), loadOptions);
        }

        [HttpPut]
        public IActionResult UpdateTask(int key, string values) {
            var order = _context.Tasks.First(o => o.ID == key);
            JsonConvert.PopulateObject(values, order);

            if(!TryValidateModel(order))
                return BadRequest(ModelState.GetFullErrorMessage());

            _context.SaveChanges();

            return Ok(order);
        }
    }
}
