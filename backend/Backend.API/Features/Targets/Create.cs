using Backend.API.EndpointsSettings;
using Backend.API.Services;
using Backend.DataAccess.DTO.Requests;
using Backend.DataAccess.Entities;
using Microsoft.EntityFrameworkCore;

namespace Backend.API.Features.Targets;

public class Create : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPost("/targets", async (CreateTargetsRequest request, TargetsCreateHandler handler) =>
        {
            return await handler.Handle(request);
        }).WithTags(nameof(TargetEntity));
    }
}

sealed class TargetsCreateHandler(ILogger<TargetsCreateHandler> logger, TargetsService service)
{
    public async Task<IResult> Handle(CreateTargetsRequest request)
    {
        try
        {
            logger.LogInformation($"{nameof(TargetsCreateHandler)}");

            await service.Create(request);

            return Results.Created();
        }
        catch (OperationCanceledException)
        {
            logger.LogInformation($"{nameof(TargetsCreateHandler)} was cancelled");

            return Results.StatusCode(499);
        }
        catch (DbUpdateException ex)
        {
            logger.LogError(ex.Message);

            return Results.BadRequest("Error. Attempt to write a non-existent foreign key.");
        }
        catch (NullReferenceException ex)
        {
            logger.LogError(ex, ex.Message);

            return Results.NotFound();
        }
        catch (Exception ex)
        {
            logger.LogError(ex, ex.Message);

            return Results.InternalServerError($"{nameof(TargetsCreateHandler)}");
        }
    }
}