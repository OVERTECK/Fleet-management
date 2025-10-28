using Backend.DataAccess.Entities;
using Microsoft.EntityFrameworkCore;

namespace Backend.DataAccess.Repositories;

public sealed class DriversRepository(MyDbContext dbContext)
{
    public async Task<List<DriverEntity>> GetAll()
    {
        return await dbContext.Drivers.ToListAsync();
    }

    public async Task<DriverEntity?> GetById(Guid id)
    {
        return await dbContext.Drivers.FindAsync(id);
    }

    public async Task Create(DriverEntity driver)
    {
        await dbContext.Drivers.AddAsync(driver);

        await dbContext.SaveChangesAsync();
    }

    public async Task Update(DriverEntity driver)
    {
        await dbContext.Drivers.Where(c => c.Id == driver.Id)
            .ExecuteUpdateAsync(s => s
                .SetProperty(c => c.Name, driver.Name)
                .SetProperty(c => c.LastName, driver.Name)
                .SetProperty(c => c.Pathronymic, driver.Pathronymic)
                .SetProperty(c => c.CategoryDrive, driver.CategoryDrive)
                .SetProperty(c => c.ContactData, driver.ContactData));

        await dbContext.SaveChangesAsync();
    }

    public async Task Delete(Guid id)
    {
        await dbContext.Drivers.Where(c => c.Id == id).ExecuteDeleteAsync();

        await dbContext.SaveChangesAsync();
    }
}