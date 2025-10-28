using Backend.DataAccess.Entities;
using Microsoft.EntityFrameworkCore;

namespace Backend.DataAccess.Repositories;

public sealed class CarsRepository(MyDbContext dbContext)
{
    public async Task<List<CarEntity>> GetAll()
    {
        return await dbContext.Cars.ToListAsync();
    }

    public async Task<CarEntity?> GetById(string VIN)
    {
        return await dbContext.Cars.FindAsync(VIN);
    }

    public async Task Create(CarEntity car)
    {
        await dbContext.Cars.AddAsync(car);

        await dbContext.SaveChangesAsync();
    }

    public async Task Update(CarEntity car)
    {
        await dbContext.Cars.Where(c => c.VIN == car.VIN)
            .ExecuteUpdateAsync(s => s
                .SetProperty(c => c.VIN, car.VIN)
                .SetProperty(c => c.Model, car.Model)
                .SetProperty(c => c.Number, car.Number)
                .SetProperty(c => c.Status, car.Status)
                .SetProperty(c => c.TotalKM, car.TotalKM));

        await dbContext.SaveChangesAsync();
    }

    public async Task Delete(string VIN)
    {
        await dbContext.Cars.Where(c => c.VIN == VIN).ExecuteDeleteAsync();

        await dbContext.SaveChangesAsync();
    }
}