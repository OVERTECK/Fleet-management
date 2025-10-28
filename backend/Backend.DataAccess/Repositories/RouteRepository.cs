using Backend.DataAccess.Entities;
using Microsoft.EntityFrameworkCore;

namespace Backend.DataAccess.Repositories;

public class RouteRepository(MyDbContext dbContext)
{
    public async Task<List<RouteEntity>> GetAll()
    {
        return await dbContext.Routes.ToListAsync();
    }

    public async Task<RouteEntity?> GetById(Guid id)
    {
        return await dbContext.Routes.FindAsync(id);
    }

    public async Task Create(RouteEntity route)
    {
        await dbContext.Routes.AddAsync(route);

        await dbContext.SaveChangesAsync();
    }

    public async Task Update(RouteEntity route)
    {
        await dbContext.Routes.Where(c => c.Id == route.Id)
            .ExecuteUpdateAsync(s => s
                .SetProperty(c => c.Start, route.Start)
                .SetProperty(c => c.End, route.End)
                .SetProperty(c => c.CountKM, route.CountKM));

        await dbContext.SaveChangesAsync();
    }

    public async Task Delete(Guid id)
    {
        await dbContext.Routes.Where(c => c.Id == id).ExecuteDeleteAsync();

        await dbContext.SaveChangesAsync();
    }
}