using Backend.API.EndpointsSettings;
using Backend.API.Services;
using Backend.DataAccess.Entities;

namespace Backend.API.Features.GasStation;

public class GetById : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet("/gasStation/{id:guid}", async (
            Guid id,
            GasStationGetByIdHandler handler,
            CancellationToken cancellationToken) =>
        {
            return await handler.Handle(id, cancellationToken);
        }).WithTags(nameof(GasStationEntity));
    }
}

sealed class GasStationGetByIdHandler(
    ILogger<GasStationCreateHandler> logger,
    GasStationsService service)
{
    public async Task<IResult> Handle(Guid id, CancellationToken cancellationToken)
    {
        try
        {
            logger.LogInformation($"Get by id gas station");

            var searchedGasStation = await service.GetById(id, cancellationToken);

            return Results.Ok(searchedGasStation);
        }
        catch (OperationCanceledException)
        {
            logger.LogInformation($"{nameof(GasStationGetByIdHandler)} was cancelled");

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

            return Results.InternalServerError($"Error get by id {nameof(GasStationGetByIdHandler)}: {ex.Message}");
        }
    }
}