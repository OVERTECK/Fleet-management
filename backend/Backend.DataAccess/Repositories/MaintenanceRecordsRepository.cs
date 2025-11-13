using Backend.DataAccess.Entities;
using Microsoft.EntityFrameworkCore;

namespace Backend.DataAccess.Repositories;

public class MaintenanceRecordsRepository(MyDbContext dbContext)
{
    public async Task<List<MaintenanceRecordEntity>> GetAll(CancellationToken cancellationToken)
    {
        return await dbContext.MaintenanceRecords.ToListAsync(cancellationToken);
    }

    public async Task<MaintenanceRecordEntity?> GetById(Guid id, CancellationToken cancellationToken)
    {
        var searchedMaintenanceRecord = await dbContext.MaintenanceRecords
            .FirstOrDefaultAsync(c => c.Id == id, cancellationToken);

        if (searchedMaintenanceRecord == null)
        {
            throw new NullReferenceException($"Maintenance record with id {id} not found.");
        }

        return searchedMaintenanceRecord;
    }

    public async Task Create(MaintenanceRecordEntity maintenanceRecord, CancellationToken cancellationToken)
    {
        await dbContext.MaintenanceRecords.AddAsync(maintenanceRecord, cancellationToken);

        await dbContext.SaveChangesAsync(cancellationToken);
    }

    public async Task Update(MaintenanceRecordEntity maintenanceRecord, CancellationToken cancellationToken)
    {
        await dbContext.MaintenanceRecords.Where(c => c.Id == maintenanceRecord.Id)
            .ExecuteUpdateAsync(
                s => s
                .SetProperty(c => c.CarId, maintenanceRecord.CarId)
                .SetProperty(c => c.Price, maintenanceRecord.Price)
                .SetProperty(c => c.TypeWork, maintenanceRecord.TypeWork), cancellationToken);
    }

    public async Task Delete(Guid id, CancellationToken cancellationToken)
    {
        await dbContext.MaintenanceRecords.Where(c => c.Id == id).ExecuteDeleteAsync(cancellationToken);
    }
}