using Backend.DataAccess;
using Microsoft.ApplicationInsights;

namespace Backend.Tests.Common;

public abstract class TestCommandBase<TFactory> : IDisposable
    where TFactory : BaseContextFactory, new()
{
    protected readonly MyDbContext Context;
    private readonly BaseContextFactory _factory;
    

    public TestCommandBase()
    {
        _factory = new TFactory();
        Context = _factory.Create();
    }
    
    public void Dispose()
    {
        _factory.Destroy(Context);
    }
}