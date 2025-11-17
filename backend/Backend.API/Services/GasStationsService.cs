using Backend.DataAccess.DTO.Requests;
using Backend.DataAccess.Entities;
using Backend.DataAccess.Repositories;

namespace Backend.API.Services;

public class GasStationsService(ILogger<GasStationsService> logger, GasStationsRepository repository)
{
    public async Task<List<GasStationEntity>> GetAll(CancellationToken cancellationToken = default)
    {
        logger.LogInformation($"{nameof(GasStationsService)}: Get all gas stations");

        return await repository.GetAll(cancellationToken);
    }

    public async Task<GasStationEntity?> GetById(Guid id, CancellationToken cancellationToken = default)
    {
        logger.LogInformation($"{nameof(GasStationsService)}: Get gas station by id");

        return await repository.GetById(id, cancellationToken);
    }

    public async Task Create(CreateGasStationRequest gasStationRequest, CancellationToken cancellationToken)
    {
        logger.LogInformation($"{nameof(GasStationsService)}: Create gas station");

        var gasStation = new GasStationEntity
        {
            Id = Guid.NewGuid(),
            Date = gasStationRequest.Date,
            CarId = gasStationRequest.CarId,
            Price = gasStationRequest.Price,
            RefilledLiters = gasStationRequest.RefilledLiters,
        };

        await repository.Create(gasStation, cancellationToken);
    }

    public async Task Update(GasStationEntity gasStation, CancellationToken cancellationToken)
    {
        logger.LogInformation($"{nameof(GasStationsService)}: Update gas station");

        await repository.Update(gasStation, cancellationToken);
    }

    public async Task Delete(Guid id, CancellationToken cancellationToken)
    {
        logger.LogInformation($"{nameof(GasStationsService)}: Delete gas station");

        await repository.Delete(id, cancellationToken);
    }
}