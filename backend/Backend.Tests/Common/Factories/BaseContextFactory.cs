using Backend.DataAccess;
using Microsoft.EntityFrameworkCore;

namespace Backend.Tests.Common;

public abstract class BaseContextFactory
{
    protected abstract void SeedData(MyDbContext context);
    
    public virtual MyDbContext Create()
    {
        var options = new DbContextOptionsBuilder<MyDbContext>()
            .UseInMemoryDatabase($"{GetType().Name}_{Guid.NewGuid()}")
            .Options;
        
        var context = new MyDbContext(options);
        
        context.Database.EnsureCreated();
        
        SeedData(context);
        
        context.SaveChanges();
        
        return context;
    }
    
    public virtual void Destroy(MyDbContext context)
    {
        context.Database.EnsureDeleted();
        context.Dispose();
    }
}