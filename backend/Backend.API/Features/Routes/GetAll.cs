using Backend.API.EndpointsSettings;
using Backend.API.Services;
using Backend.DataAccess.Entities;

namespace Backend.API.Features.Routes;

public class GetAll : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet("/routes", async (RoutesGetAllHandler handler) =>
        {
            return await handler.Handle();
        }).WithTags(nameof(RouteEntity));
    }
}

sealed class RoutesGetAllHandler(ILogger<RoutesCreateHandler> logger, RoutesService service)
{
    public async Task<IResult> Handle()
    {
        try
        {
            logger.LogInformation($"Get all route.");

            var routes = await service.GetAll();

            return Results.Ok(routes);
        }
        catch (OperationCanceledException)
        {
            logger.LogInformation($"{nameof(RoutesGetAllHandler)} was cancelled");

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

            return Results.InternalServerError($"Error get all {nameof(RoutesGetAllHandler)}: {ex.Message}");
        }
    }
}