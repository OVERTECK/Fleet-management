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

sealed class TripsReportHandler(ReportsService reportsService)
{
    public async Task<IResult> Handle(IHttpContextAccessor httpContextAccessor)
    {
        var file = await reportsService.CreateReport<TripEntity>(httpContextAccessor);

        return file;
    }
}