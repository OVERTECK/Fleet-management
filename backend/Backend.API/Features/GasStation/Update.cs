using Backend.API.EndpointsSettings;
using Backend.API.Services;
using Backend.DataAccess.Entities;
using Microsoft.EntityFrameworkCore;

namespace Backend.API.Features.GasStation;

public class Update : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPut("/gasStation", async (
            GasStationEntity entity,
            GasStationUpdateHandler handler,
            CancellationToken cancellationToken) =>
        {
            return await handler.Handle(entity, cancellationToken);
        }).WithTags(nameof(GasStationEntity));
    }
}

sealed class GasStationUpdateHandler(
    ILogger<GasStationCreateHandler> logger,
    GasStationsService service)
{
    public async Task<IResult> Handle(GasStationEntity entity, CancellationToken cancellationToken)
    {
        try
        {
            logger.LogInformation($"Update gas station");

            await service.Update(entity, cancellationToken);

            return Results.Ok();
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
        catch (DbUpdateException ex)
        {
            logger.LogError(ex.Message);

            return Results.BadRequest("Error. Attempt to write a non-existent foreign key.");
        }
        catch (Exception ex)
        {
            logger.LogError(ex, ex.Message);

            return Results.InternalServerError($"Error update {nameof(GasStationGetByIdHandler)}: {ex.Message}");
        }
    }
}