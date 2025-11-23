using Backend.API.EndpointsSettings;
using Backend.API.Services;
using Backend.DataAccess.DTO.Requests;
using Backend.DataAccess.Entities;
using Microsoft.EntityFrameworkCore;

namespace Backend.API.Features.GasStation;

public class CreateGasStationEndpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPost("/gasStation", async (
            CreateGasStationRequest gasStationRequest,
            GasStationCreateHandler handler,
            CancellationToken cancellationToken) =>
        {
            return await handler.Handle(gasStationRequest, cancellationToken);
        }).WithTags(nameof(GasStationEntity));
    }
}

sealed class GasStationCreateHandler(
    ILogger<GasStationCreateHandler> logger,
    GasStationsService service)
{
    public async Task<IResult> Handle(
        CreateGasStationRequest gasStationRequest,
        CancellationToken cancellationToken)
    {
        try
        {
            logger.LogInformation($"Creating gasStation");

            await service.Create(gasStationRequest, cancellationToken);

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
        catch (DbUpdateException ex)
        {
            logger.LogError(ex.Message);

            return Results.BadRequest("Error. Attempt to write a non-existent foreign key.");
        }
        catch (Exception ex)
        {
            logger.LogError(ex, ex.Message);

            return Results.InternalServerError($"Error creating {nameof(GasStationEntity)}: {ex.Message}");
        }
    }
}