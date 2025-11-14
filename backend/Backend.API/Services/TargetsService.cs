using Backend.DataAccess.DTO.Requests;
using Backend.DataAccess.Entities;
using Backend.DataAccess.Repositories;

namespace Backend.API.Services;

public class TargetsService(ILogger<TargetsService> logger, TargetsRepository repository)
{
    public async Task<List<TargetEntity>> GetAll()
    {
        logger.LogInformation($"{nameof(TargetEntity)}: Get all maintenance records");

        return await repository.GetAll();
    }

    public async Task<TargetEntity?> GetById(Guid id)
    {
        logger.LogInformation($"{nameof(TargetEntity)}: Get maintenance records by id");

        return await repository.GetById(id);
    }

    public async Task Create(CreateTargetsRequest request)
    {
        logger.LogInformation($"{nameof(TargetEntity)}: Create maintenance record");

        var target = new TargetEntity
        {
            Id = Guid.NewGuid(),
            CarId = request.CarId,
            DriverId = request.DriverId,
            Start = request.Start,
            End = request.End,
        };

        await repository.Create(target);
    }

    public async Task Update(UpdateTargetRequest request)
    {
        logger.LogInformation($"{nameof(TargetEntity)}: Update maintenance record");

        var target = new TargetEntity
        {
            Id = request.Id,
            CarId = request.CarId,
            DriverId = request.DriverId,
            Start = request.Start,
            End = request.End,
        };

        await repository.Update(target);
    }

    public async Task Delete(Guid id)
    {
        logger.LogInformation($"{nameof(TargetEntity)}: Delete maintenance record");

        await repository.Delete(id);
    }
}