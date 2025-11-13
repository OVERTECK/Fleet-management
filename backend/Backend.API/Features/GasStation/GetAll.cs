using Backend.API.EndpointsSettings;
using Backend.API.Services;
using Backend.DataAccess.Entities;

namespace Backend.API.Features.GasStation;

public class GetAll : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet("/gasStations", async (
            GasStationGetAllHandler handler,
            CancellationToken cancellationToken) =>
        {
            return await handler.Handle(cancellationToken);
        }).WithTags(nameof(GasStationEntity));
    }
}

sealed class GasStationGetAllHandler(
    ILogger<GasStationCreateHandler> logger,
    GasStationsService service)
{
    public async Task<IResult> Handle(CancellationToken cancellationToken)
    {
        try
        {
            logger.LogInformation($"Get all gas station");

            var searchedGasStations = await service.GetAll(cancellationToken);

            return Results.Ok(searchedGasStations);
        }
        catch (OperationCanceledException)
        {
            logger.LogInformation($"{nameof(GasStationGetAllHandler)} was cancelled");

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

            return Results.InternalServerError($"Error get all {nameof(GasStationEntity)}: {ex.Message}");
        }
    }
}