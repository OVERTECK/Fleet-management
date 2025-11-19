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

        var logTarget = $"{nameof(GetById)};{id}";

        await File.AppendAllTextAsync($"../logs/{nameof(TargetsService)}.csv", logTarget);

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

        var logTarget = $"{nameof(Create)};"+
                        $"{target.Id};" +
                        $"{target.DriverId};" +
                        $"{target.CarId};" +
                        $"{target.Start};" +
                        $"{target.End}\n";

        await File.AppendAllTextAsync($"../logs/{nameof(TargetsService)}.csv", logTarget);

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

        var logTarget = $"{nameof(Update)};"+
                        $"{target.Id};" +
                        $"{target.DriverId};" +
                        $"{target.CarId};" +
                        $"{target.Start};" +
                        $"{target.End}\n";

        await File.AppendAllTextAsync($"../logs/{nameof(TargetsService)}.csv", logTarget);

        await repository.Update(target);
    }

    public async Task Delete(Guid id)
    {
        logger.LogInformation($"{nameof(TargetEntity)}: Delete maintenance record");

        var logTarget = $"{nameof(Delete)};{id}\n";

        await File.AppendAllTextAsync($"../logs/{nameof(TargetsService)}.csv", logTarget);

        await repository.Delete(id);
    }
}