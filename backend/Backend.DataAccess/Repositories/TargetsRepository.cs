using Backend.DataAccess.Entities;
using Microsoft.EntityFrameworkCore;

namespace Backend.DataAccess.Repositories;

public class TargetsRepository(MyDbContext dbContext)
{
    public async Task<List<TargetEntity>> GetAll()
    {
        return await dbContext.Targets.ToListAsync();
    }

    public async Task<TargetEntity?> GetById(Guid id)
    {
        return await dbContext.Targets.FindAsync(id);
    }

    public async Task Create(TargetEntity target)
    {
        await dbContext.Targets.AddAsync(target);

        await dbContext.SaveChangesAsync();
    }

    public async Task Update(TargetEntity target)
    {
        await dbContext.Targets.Where(c => c.Id == target.Id)
            .ExecuteUpdateAsync(s => s
                .SetProperty(c => c.CarId, target.CarId)
                .SetProperty(c => c.DriverId, target.DriverId)
                .SetProperty(c => c.Start, target.Start)
                .SetProperty(c => c.End, target.End));

        await dbContext.SaveChangesAsync();
    }

    public async Task Delete(Guid id)
    {
        await dbContext.Targets.Where(c => c.Id == id).ExecuteDeleteAsync();

        await dbContext.SaveChangesAsync();
    }
}