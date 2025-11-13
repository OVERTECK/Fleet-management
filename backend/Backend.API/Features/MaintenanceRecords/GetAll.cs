using Backend.API.EndpointsSettings;
using Backend.API.Services;
using Backend.DataAccess.Entities;

namespace Backend.API.Features.MaintenanceRecords;

public class GetAll : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet("/maintenanceRecords", async (
            MaintenanceRecordGetAllHandler handler,
            CancellationToken cancellationToken) =>
        {
            return await handler.Handle(cancellationToken);
        }).WithTags(nameof(MaintenanceRecordEntity));
    }
}

sealed class MaintenanceRecordGetAllHandler(
    ILogger<MaintenanceRecordDeleteHandler> logger,
    MaintenanceRecordsService service)
{
    public async Task<IResult> Handle(CancellationToken cancellationToken)
    {
        try
        {
            logger.LogInformation($"Creating maintenance record.");

            var searchedMaintenanceRecords = await service.GetAll(cancellationToken);

            return Results.Ok(searchedMaintenanceRecords);
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
        catch (Exception ex)
        {
            logger.LogError(ex, ex.Message);

            return Results.InternalServerError($"Error creating {nameof(MaintenanceRecordCreateHandler)}: {ex.Message}");
        }
    }
}