using Backend.API.EndpointsSettings;
using Backend.API.Services;
using Backend.DataAccess.Entities;

namespace Backend.API.Features.Routes;

public class GetById : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet("/routes/{id:guid}", async (Guid id, RoutesGetByIdHandler handler) =>
        {
            return await handler.Handle(id);
        }).WithTags(nameof(RouteEntity));
    }
}

sealed class RoutesGetByIdHandler(ILogger<RoutesCreateHandler> logger, RoutesService service)
{
    public async Task<IResult> Handle(Guid id)
    {
        try
        {
            logger.LogInformation($"{nameof(RoutesGetByIdHandler)}");

            var route = await service.GetById(id);

            return Results.Ok(route);
        }
        catch (OperationCanceledException)
        {
            logger.LogInformation($"{nameof(RoutesGetByIdHandler)} was cancelled");

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

            return Results.InternalServerError($"Error {nameof(RoutesGetByIdHandler)}: {ex.Message}");
        }
    }
}