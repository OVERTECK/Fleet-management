using Backend.API.EndpointsSettings;
using Backend.API.Services;
using Backend.DataAccess.DTO.Requests;
using Backend.DataAccess.Entities;

namespace Backend.API.Features.MaintenanceRecords;

public class Update : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPut("/maintenanceRecords", async (
            UpdateMaintenanceRecordRequest request,
            MaintenanceRecordUpdateHandler handler,
            CancellationToken cancellationToken) =>
        {
            return await handler.Handle(request, cancellationToken);
        }).WithTags(nameof(MaintenanceRecordEntity));
    }
}

sealed class MaintenanceRecordUpdateHandler(
    ILogger<MaintenanceRecordCreateHandler> logger,
    MaintenanceRecordsService service)
{
    public async Task<IResult> Handle(
        UpdateMaintenanceRecordRequest request,
        CancellationToken cancellationToken)
    {
        try
        {
            logger.LogInformation($"Updating maintenance record.");

            await service.Update(request, cancellationToken);

            return Results.Ok();
        }
        catch (OperationCanceledException)
        {
            logger.LogInformation($"{nameof(MaintenanceRecordCreateHandler)} was cancelled");

            return Results.StatusCode(499);
        }
        catch (NullReferenceException ex)
        {
            logger.LogError(ex, ex.Message);

            return Results.NotFound("Maintenance record not found");
        }
        catch (Exception ex)
        {
            logger.LogError(ex, ex.Message);

            return Results.InternalServerError(
                $"Error updating {nameof(MaintenanceRecordCreateHandler)}");
        }
    }
}