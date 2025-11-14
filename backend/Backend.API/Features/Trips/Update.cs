using Backend.API.EndpointsSettings;
using Backend.API.Services;
using Backend.DataAccess.DTO.Requests;
using Backend.DataAccess.Entities;

namespace Backend.API.Features.Trips;

public class Update : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPut("/trips", async (UpdateTripRequest request, TripsUpdateHandler handler) =>
        {
            return await handler.Handle(request);
        }).WithTags(nameof(TripEntity));
    }
}

sealed class TripsUpdateHandler(ILogger<TripsUpdateHandler> logger, TripsService service)
{
    public async Task<IResult> Handle(UpdateTripRequest request)
    {
        try
        {
            logger.LogInformation($"{nameof(TripsUpdateHandler)}");

            await service.Update(request);

            return Results.Ok();
        }
        catch (OperationCanceledException)
        {
            logger.LogInformation($"{nameof(TripsUpdateHandler)} was cancelled");

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

            return Results.InternalServerError($"{nameof(TripsUpdateHandler)}");
        }
    }
}