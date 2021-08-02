using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using sitemercado.Models;
using sitemercado.Repositories;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace sitemercado.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class ProdutosController : Controller
  {
    private readonly IProdutoRepository repository;
    public ProdutosController(IProdutoRepository _context)
    {
      repository = _context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Produtos>>> GetProdutos()
    {
      var produtos = await repository.GetAll();
      if (produtos == null)
      {
        return BadRequest();
      }
      return Ok(produtos.ToList());
    }

    // GET: api/Products/5
    [HttpGet("{id}")]
    public async Task<ActionResult<Produtos>> GetProduto(int id)
    {
      var produto = await repository.GetById(id);
      if (produto == null)
      {
        return NotFound("Produto não encontrado pelo id informado");
      }
      return Ok(produto);
    }

    // POST api/<controller>  
    [HttpPost]
    public async Task<IActionResult> PostProduto([FromBody]Produtos produto)
    {
      if (produto == null)
      {
        return BadRequest("Produto é null");
      }
      await repository.Insert(produto);
      return CreatedAtAction(nameof(GetProduto), new { Id = produto.ProdutoId }, produto);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> PutProduto(int id, Produtos produto)
    {
      if (id != produto.ProdutoId)
      {
        return BadRequest($"O código do produto {id} não confere");
      }
      try
      {
        await repository.Update(id, produto);
      }
      catch (DbUpdateConcurrencyException)
      {
        throw;
      }
      return CreatedAtAction(nameof(GetProduto), new { Id = produto.ProdutoId }, produto);//Ok("Atualização do produto realizada com sucesso");
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult<Produtos>> DeleteProduto(int id)
    {
      var produto = await repository.GetById(id);
      if (produto == null)
      {
        return NotFound($"Produto de {id} foi não encontrado");
      }
      await repository.Delete(id);
      return Ok(produto);
    }
  }
}
