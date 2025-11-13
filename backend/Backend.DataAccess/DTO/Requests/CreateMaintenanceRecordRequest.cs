using Backend.DataAccess.Entities;

namespace Backend.DataAccess.DTO.Requests;

public class CreateMaintenanceRecordRequest
{
    public string CarId { get; set; }

    public string TypeWork { get; set; }

    public Decimal Price { get; set; }
}