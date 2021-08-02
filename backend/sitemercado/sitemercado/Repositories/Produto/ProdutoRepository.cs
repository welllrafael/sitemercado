using sitemercado.Models;

namespace sitemercado.Repositories.Produto
{
  public class ProdutoRepository : GenericRepository<Produtos>, IProdutoRepository
  {
    public ProdutoRepository(AppDbContext repositoryContext)
         : base(repositoryContext)
    {
    }
  }
}
