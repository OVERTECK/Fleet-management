using Backend.DataAccess.Entities;
using Microsoft.EntityFrameworkCore;

namespace Backend.DataAccess.Repositories;

public sealed class CarsRepository(MyDbContext dbContext)
{
    public async Task<List<CarEntity>> GetAll()
    {
        return await dbContext.Cars.ToListAsync();
    }

    public async Task<CarEntity?> GetByVIN(string vin)
    {
        var seachedCar = await dbContext.Cars.FirstOrDefaultAsync(c => c.VIN == vin);

        if (seachedCar == null)
        {
            throw new NullReferenceException($"Car with vin {vin} not found");
        }

        return seachedCar;
    }

    public async Task Create(CarEntity car)
    {
        await dbContext.Cars.AddAsync(car);

        await dbContext.SaveChangesAsync();
    }

    public async Task Update(CarEntity car)
    {
        var searchedCar = await dbContext.Cars.FirstOrDefaultAsync(c => c.VIN == car.VIN);

        if (searchedCar == null)
        {
            throw new NullReferenceException($"Car with vin {car.VIN} not found");
        }

        await dbContext.Cars.Where(c => c.VIN == car.VIN)
            .ExecuteUpdateAsync(s => s
                .SetProperty(c => c.VIN, car.VIN)
                .SetProperty(c => c.Model, car.Model)
                .SetProperty(c => c.Number, car.Number)
                .SetProperty(c => c.Status, car.Status)
                .SetProperty(c => c.TotalKM, car.TotalKM));

        await dbContext.SaveChangesAsync();
    }

    public async Task Delete(string vin)
    {
        var searchedCar = await dbContext.Cars.FirstOrDefaultAsync(c => c.VIN == vin);

        if (searchedCar == null)
        {
            throw new NullReferenceException($"Car with vin {vin} not found");
        }

        await dbContext.Cars.Where(c => c.VIN == vin).ExecuteDeleteAsync();

        await dbContext.SaveChangesAsync();
    }

    public async Task EnsureExists(string id)
    {
        var car = await dbContext.Cars.FindAsync(id);

        if (car == null)
        {
            throw new NullReferenceException($"Unable to find car with id {id}");
        }
    }
}