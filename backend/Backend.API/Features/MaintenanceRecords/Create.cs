using Backend.API.EndpointsSettings;
using Backend.API.Services;
using Backend.DataAccess.DTO.Requests;
using Backend.DataAccess.Entities;
using Microsoft.EntityFrameworkCore;

namespace Backend.API.Features.MaintenanceRecords;

public class Create : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPost("/maintenanceRecords", async (
            CreateMaintenanceRecordRequest request,
            MaintenanceRecordCreateHandler handler,
            CancellationToken cancellationToken) =>
        {
            return await handler.Handle(request, cancellationToken);
        }).WithTags(nameof(MaintenanceRecordEntity));
    }
}

sealed class MaintenanceRecordCreateHandler(
    ILogger<MaintenanceRecordCreateHandler> logger,
    MaintenanceRecordsService service)
{
    public async Task<IResult> Handle(
        CreateMaintenanceRecordRequest entity,
        CancellationToken cancellationToken)
    {
        try
        {
            logger.LogInformation($"Creating maintenance record.");

            await service.Create(entity, cancellationToken);

            return Results.Created();
        }
        catch (OperationCanceledException)
        {
            logger.LogInformation($"{nameof(MaintenanceRecordCreateHandler)} was cancelled");

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

            return Results.InternalServerError($"Error creating {nameof(MaintenanceRecordCreateHandler)}: {ex.Message}");
        }
    }
}