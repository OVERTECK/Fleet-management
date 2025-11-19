using Backend.DataAccess.Entities;

namespace Backend.DataAccess.DTO.Requests;

public class CreateMaintenanceRecordRequest
{
    public required string CarId { get; set; }

    public required string TypeWork { get; set; }

    public required Decimal Price { get; set; }

    public required DateTime Date { get; set; }
}