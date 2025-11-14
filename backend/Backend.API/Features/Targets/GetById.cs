using Backend.API.EndpointsSettings;
using Backend.API.Services;
using Backend.DataAccess.Entities;

namespace Backend.API.Features.Targets;

public class GetById : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet("/targets/{id:guid}", async (Guid id, TargetsGetByIdHandler handler) =>
        {
            return await handler.Handle(id);
        }).WithTags(nameof(TargetEntity));
    }
}

sealed class TargetsGetByIdHandler(ILogger<TargetsGetByIdHandler> logger, TargetsService service)
{
    public async Task<IResult> Handle(Guid id)
    {
        try
        {
            logger.LogInformation($"{nameof(TargetsGetByIdHandler)}");

            var target = await service.GetById(id);

            return Results.Ok(target);
        }
        catch (OperationCanceledException)
        {
            logger.LogInformation($"{nameof(TargetsGetByIdHandler)} was cancelled");

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

            return Results.InternalServerError($"{nameof(TargetsGetByIdHandler)}");
        }
    }
}