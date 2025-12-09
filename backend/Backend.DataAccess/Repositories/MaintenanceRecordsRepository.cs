using Backend.DataAccess.Entities;
using Microsoft.EntityFrameworkCore;

namespace Backend.DataAccess.Repositories;

public class MaintenanceRecordsRepository(MyDbContext dbContext)
{
    public async Task<List<MaintenanceRecordEntity>> GetAll(CancellationToken cancellationToken)
    {
        return await dbContext.MaintenanceRecords
            .AsNoTracking()
            .Include(c => c.Car)
            .ToListAsync(cancellationToken);
    }

    public async Task<MaintenanceRecordEntity?> GetById(Guid id, CancellationToken cancellationToken)
    {
        await this.EnsureExists(id);

        var searchedMaintenanceRecord = await dbContext.MaintenanceRecords
            .AsNoTracking()
            .Include(c => c.Car)
            .FirstOrDefaultAsync(c => c.Id == id, cancellationToken);

        return searchedMaintenanceRecord;
    }

    public async Task Create(MaintenanceRecordEntity maintenanceRecord, CancellationToken cancellationToken)
    {
        await dbContext.MaintenanceRecords.AddAsync(maintenanceRecord, cancellationToken);

        await dbContext.SaveChangesAsync(cancellationToken);
    }

    public async Task Update(
        MaintenanceRecordEntity maintenanceRecord,
        CancellationToken cancellationToken)
    {
        await this.EnsureExists(maintenanceRecord.Id);

        await dbContext.MaintenanceRecords.Where(c => c.Id == maintenanceRecord.Id)
            .ExecuteUpdateAsync(
                s => s
                .SetProperty(c => c.CarId, maintenanceRecord.CarId)
                .SetProperty(c => c.Price, maintenanceRecord.Price)
                .SetProperty(c => c.TypeWork, maintenanceRecord.TypeWork), cancellationToken);
    }

    public async Task Delete(Guid id, CancellationToken cancellationToken)
    {
        await this.EnsureExists(id);

        await dbContext.MaintenanceRecords.Where(c => c.Id == id).ExecuteDeleteAsync(cancellationToken);
    }

    public async Task EnsureExists(Guid id)
    {
        var searchedMaintenanceRecord = await dbContext.MaintenanceRecords.FindAsync(id);

        if (searchedMaintenanceRecord == null)
        {
            throw new NullReferenceException($"Unable to find maintenance record with id {id}");
        }
    }
}