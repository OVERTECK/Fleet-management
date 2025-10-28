using Backend.DataAccess.Entities;
using Microsoft.EntityFrameworkCore;

namespace Backend.DataAccess.Repositories;

public class MaintenanceRecordsRepository(MyDbContext dbContext)
{
    public async Task<List<MaintenanceRecordEntity>> GetAll()
    {
        return await dbContext.MaintenanceRecords.ToListAsync();
    }

    public async Task<MaintenanceRecordEntity?> GetById(Guid id)
    {
        return await dbContext.MaintenanceRecords.FindAsync(id);
    }

    public async Task Create(MaintenanceRecordEntity maintenanceRecord)
    {
        await dbContext.MaintenanceRecords.AddAsync(maintenanceRecord);

        await dbContext.SaveChangesAsync();
    }

    public async Task Update(MaintenanceRecordEntity maintenanceRecord)
    {
        await dbContext.MaintenanceRecords.Where(c => c.Id == maintenanceRecord.Id)
            .ExecuteUpdateAsync(s => s
                .SetProperty(c => c.CarId, maintenanceRecord.CarId)
                .SetProperty(c => c.Price, maintenanceRecord.Price)
                .SetProperty(c => c.TypeWork, maintenanceRecord.TypeWork));

        await dbContext.SaveChangesAsync();
    }

    public async Task Delete(Guid id)
    {
        await dbContext.MaintenanceRecords.Where(c => c.Id == id).ExecuteDeleteAsync();

        await dbContext.SaveChangesAsync();
    }
}