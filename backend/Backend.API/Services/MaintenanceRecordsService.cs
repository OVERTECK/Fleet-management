using Backend.DataAccess.DTO.Requests;
using Backend.DataAccess.Entities;
using Backend.DataAccess.Repositories;

namespace Backend.API.Services;

public class MaintenanceRecordsService(MaintenanceRecordsRepository repository, ILogger<MaintenanceRecordsService> logger)
{
    public async Task<List<MaintenanceRecordEntity>> GetAll(CancellationToken cancellationToken)
    {
        logger.LogInformation($"{nameof(MaintenanceRecordEntity)}: Get all maintenance records");

        return await repository.GetAll(cancellationToken);
    }

    public async Task<MaintenanceRecordEntity?> GetById(Guid id, CancellationToken cancellationToken)
    {
        logger.LogInformation($"{nameof(MaintenanceRecordEntity)}: Get maintenance records by id");

        return await repository.GetById(id, cancellationToken);
    }

    public async Task Create(CreateMaintenanceRecordRequest request, CancellationToken cancellationToken)
    {
        logger.LogInformation($"{nameof(MaintenanceRecordEntity)}: Create maintenance record");

        var maintenanceRecord = new MaintenanceRecordEntity
        {
            Id = Guid.NewGuid(),
            CarId = request.CarId,
            TypeWork = request.TypeWork,
        };

        await repository.Create(maintenanceRecord, cancellationToken);
    }

    public async Task Update(MaintenanceRecordEntity maintenanceRecord, CancellationToken cancellationToken)
    {
        logger.LogInformation($"{nameof(MaintenanceRecordEntity)}: Update maintenance record");

        await repository.Update(maintenanceRecord, cancellationToken);
    }

    public async Task Delete(Guid id, CancellationToken cancellationToken)
    {
        logger.LogInformation($"{nameof(MaintenanceRecordEntity)}: Delete maintenance record");

        await repository.Delete(id, cancellationToken);
    }
}