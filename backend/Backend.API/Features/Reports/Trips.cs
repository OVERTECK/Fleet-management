using Backend.API.EndpointsSettings;
using Backend.API.Services;
using Backend.DataAccess.Entities;
using ClosedXML.Excel;

namespace Backend.API.Features.Reports;

public class TripsReport : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet("/reports/trips", async (
            TripsReportHandler handler,
            IHttpContextAccessor httpContextAccessor) =>
        {
            return await handler.Handle(httpContextAccessor);
        }).WithTags("Reports");
    }
}

sealed class TripsReportHandler(
    ReportsService reportsService,
    ILogger<TripsReportHandler> logger)
{
    public async Task<IResult> Handle(IHttpContextAccessor httpContextAccessor)
    {
        try
        {
            var file = await reportsService.CreateReport(httpContextAccessor);

            return file;
        }
        catch (Exception ex)
        {
            logger.LogError(ex, ex.Message);

            return Results.InternalServerError();
        }
    }
}