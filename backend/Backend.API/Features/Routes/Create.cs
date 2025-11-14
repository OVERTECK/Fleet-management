using Backend.API.EndpointsSettings;
using Backend.API.Services;
using Backend.DataAccess.DTO.Requests;
using Backend.DataAccess.Entities;

namespace Backend.API.Features.Routes;

public class Create : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPost("/routes", async (CreateRouteRequest request, RoutesCreateHandler handler) =>
        {
            return await handler.Handle(request);
        }).WithTags(nameof(RouteEntity));
    }
}

sealed class RoutesCreateHandler(ILogger<RoutesCreateHandler> logger, RoutesService service)
{
    public async Task<IResult> Handle(CreateRouteRequest request)
    {
        try
        {
            logger.LogInformation($"Creating route.");

            await service.Create(request);

            return Results.Created();
        }
        catch (OperationCanceledException)
        {
            logger.LogInformation($"{nameof(RoutesCreateHandler)} was cancelled");

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

            return Results.InternalServerError($"Error creating {nameof(RoutesCreateHandler)}: {ex.Message}");
        }
    }
}