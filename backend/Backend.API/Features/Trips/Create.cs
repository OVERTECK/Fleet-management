using Backend.API.EndpointsSettings;
using Backend.API.Services;
using Backend.DataAccess.DTO.Requests;
using Backend.DataAccess.Entities;

namespace Backend.API.Features.Trips;

public class Create : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPost("/trips", async (CreateTripRequest request, TripsCreateHandler handler) =>
        {
            return await handler.Handle(request);
        }).WithTags(nameof(TripEntity));
    }
}

sealed class TripsCreateHandler(ILogger<TripsCreateHandler> logger, TripsService service)
{
    public async Task<IResult> Handle(CreateTripRequest request)
    {
        try
        {
            logger.LogInformation($"{nameof(TripsCreateHandler)}");

            await service.Create(request);

            return Results.Created();
        }
        catch (OperationCanceledException)
        {
            logger.LogInformation($"{nameof(TripsCreateHandler)} was cancelled");

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

            return Results.InternalServerError($"{nameof(TripsCreateHandler)}");
        }
    }
}