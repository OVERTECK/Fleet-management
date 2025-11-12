using Backend.API.EndpointsSettings;
using Backend.API.Services;
using Backend.DataAccess.Entities;

namespace Backend.API.Features.GasStation;

public class CreateGasStationEndpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPost("/gasStation", async (
            GasStationEntity entity,
            GasStationCreateHandler handler,
            CancellationToken cancellationToken) =>
        {
            return await handler.Handle(entity, cancellationToken);
        });
    }
}

sealed class GasStationCreateHandler(
    ILogger<GasStationCreateHandler> logger,
    GasStationsService service)
{
    public async Task<IResult> Handle(
        GasStationEntity entity,
        CancellationToken cancellationToken)
    {
        try
        {
            logger.LogInformation($"Creating driver: {entity.Id}");

            await service.Create(entity, cancellationToken);

            return Results.Created();
        }
        catch (OperationCanceledException)
        {
            logger.LogInformation($"{nameof(GasStationCreateHandler)} was cancelled");

            return Results.StatusCode(499);
        }
        catch (NullReferenceException ex)
        {
            logger.LogError(ex, ex.Message);

            return Results.NotFound();
        }
        catch (Exception ex)
        {
            logger.LogError(ex, ex.Message);

            return Results.InternalServerError($"Error creating {nameof(GasStationEntity)}: {ex.Message}");
        }
    }
}