using Backend.API.EndpointsSettings;
using Backend.API.Services;
using Backend.DataAccess.Entities;

namespace Backend.API.Features.GasStation;

public class DeleteGasStationEndpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapDelete("/gasStation/{id:guid}", async (
            Guid id,
            GasStationDeleteHandler handler,
            CancellationToken cancellationToken) =>
        {
            return await handler.Handle(id, cancellationToken);
        });
    }
}

sealed class GasStationDeleteHandler(
    ILogger<GasStationCreateHandler> logger,
    GasStationsService service)
{
    public async Task<IResult> Handle(
        Guid id,
        CancellationToken cancellationToken)
    {
        try
        {
            logger.LogInformation($"Delete driver: {id}");

            await service.Delete(id, cancellationToken);

            return Results.Ok();
        }
        catch (OperationCanceledException)
        {
            logger.LogInformation($"{nameof(GasStationDeleteHandler)} was cancelled");

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

            return Results.InternalServerError($"Error delete {nameof(GasStationEntity)}: {ex.Message}");
        }
    }
}